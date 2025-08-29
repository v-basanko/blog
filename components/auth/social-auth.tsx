import Button from "@/components/common/button";
import {FaGithub, FaGoogle} from "react-icons/fa";

const SocialAuth = () => {
    return (<div className="flex flex-col gap-2 md:flex-row">
        <Button type="button" label="Continue with GitHub" outlined icon={FaGithub} />
        <Button type="button" label="Continue with Google" outlined icon={FaGoogle} />
    </div>)
}
export default SocialAuth;