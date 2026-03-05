import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
    useQuery,
    useMutation,
    UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient, safeJsonParse } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { auth } from "../lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from "firebase/auth";

type AuthContextType = {
    user: SelectUser | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
    logoutMutation: UseMutationResult<void, Error, void>;
    registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isAuthInited, setIsAuthInited] = useState(false);
    const { toast } = useToast();

    const {
        data: user,
        error,
        isLoading: isProfileLoading,
        refetch
    } = useQuery<SelectUser | null, Error>({
        queryKey: ["/api/user"],
        queryFn: getQueryFn({ on401: "returnNull" }),
        enabled: isAuthInited
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("[AUTH] Firebase auth state changed:", user?.uid);
            setFirebaseUser(user);
            setIsAuthInited(true);
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        });
        return unsubscribe;
    }, []);

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginData) => {
            // Firebase uses email, we use username as email
            const userCredential = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
            // After login, get the profile from server
            const res = await apiRequest("GET", "/api/user");
            return await safeJsonParse(res);
        },
        onSuccess: (user: SelectUser) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({ title: "Welcome back!", description: "Successfully logged in." });
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (newUser: InsertUser) => {
            // 1. Create in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, newUser.username, newUser.password);

            // 2. Create profile in Firestore via our API, passing the UID
            const res = await apiRequest("POST", "/api/register", {
                ...newUser,
                id: userCredential.user.uid
            });
            return await safeJsonParse(res);
        },
        onSuccess: (user: SelectUser) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({ title: "Account created!", description: "Welcome to FiscAI." });
        },
        onError: (error: Error) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await signOut(auth);
            await apiRequest("POST", "/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({ title: "Logged out", description: "Goodbye!" });
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading: !isAuthInited || isProfileLoading,
                error,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
