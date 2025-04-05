import UserProfileForm from "@/components/user-profile-form";
import {getUserByUsername} from "@/lib/actions/user.actions";


interface UserProfilePageProps {
    params: {
        username: string;
    };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
    // Fetch user data from your database or API
    const user = await getUserByUsername(params.username);

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <UserProfileForm initialUserData={user} />
        </div>
    );
}