import { ProfileSection } from "./components/profile-section";

export function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Your account information and preferences
        </p>
      </div>
      <ProfileSection />
    </div>
  );
}
