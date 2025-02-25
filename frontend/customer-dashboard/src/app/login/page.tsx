import ShopifyConnectForm from "@/components/ShopifyConnectForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Dashboard() {
    return <>
        <h1>Customer Login</h1>
        <ShopifyConnectForm></ShopifyConnectForm>
        <GoogleLoginButton></GoogleLoginButton>
    </>;
}