import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const [cancelled, setCancelled] = useState(false)
    const auth = getAuth()

    function checkIfIsCancelled() {
        if(cancelled){
            return
        }
    }

    const createUser = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError(null);

        try {
            const {user} = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(user, {displayName: data.displayName});

            setLoading(false);

            return user
        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage

            if(error.message.includes("password")){
                systemErrorMessage = "A senha precisa conter no minimo 8 caracteres."
            } else if (error.message.includes('email-already')){
                systemErrorMessage = "E-mail já cadastrado."
            } else if (error.message.includes('invalid-email')){
                systemErrorMessage = "Insira um e-mail valido"
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente novamente mais tarde."
            }

            setLoading(false);
            setError(systemErrorMessage)
        }
    }
    //logout

    const logout = () => {
        checkIfIsCancelled()
        signOut(auth)
    }

    //sing in
    
    const login = async(data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError(false)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)
            return userCredential;
        } catch (error) {
            let systemErrorMessage;

            if(error.message.includes("invalid-credential")){
                systemErrorMessage = "Por favor confira se o email e a senha estão corretos."
            } else if(error.message.includes('wrong-password')){
                systemErrorMessage = "Senha incorreta."
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde"
            }
            console.log(error)

            setError(systemErrorMessage)
            setLoading(false)
        }
    }
    useEffect(() =>{
        return () => setCancelled(true);
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
    };
}