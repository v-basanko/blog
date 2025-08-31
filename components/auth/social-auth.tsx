import Button from "@/components/common/button";
import {FaGithub, FaGoogle} from "react-icons/fa";
import {signIn} from "next-auth/react";
import {LOGIN_REDIRECT} from "@/routes";

const SocialAuth = () => {

    const handlOnClick = (provider: 'google' | 'github') => {
        signIn(provider, {
            redirectTo: LOGIN_REDIRECT,
        })
    }

    return (<div className="flex flex-col justify-around gap-2 md:flex-row">
        <Button onClick={() => handlOnClick('github')} type="button" label="Continue with GitHub" outlined
                icon={FaGithub}/>
        <Button onClick={() => handlOnClick('google')} type="button" label="Continue with Google" outlined
                icon={FaGoogle}/>
    </div>)
}
export default SocialAuth;