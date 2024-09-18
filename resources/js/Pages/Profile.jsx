import Common from "@/common";
import AppLayout from "@/Layouts/AppLayout";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Input } from "@nextui-org/react";
import { IconStarFilled } from "@tabler/icons-react";

function Profile({ purchased }) {
  const { auth, baseUrl } = usePage().props;
  console.log('auth', auth)

  async function onProfileUpload(e) {
    var formData = new FormData();
    var file = e.target.files[0]

    formData.append("file", file);

    const result = await axios.post(`${baseUrl}/profile/picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    window.location.reload();
  }

  return (
    <AppLayout>
      <Head title="Profile" />

      <h1 className="font-semibold text-3xl mb-8">Profile</h1>

      <img className="rounded-full size-16 mb-2" src={`${baseUrl}/storage/${auth.user.profile_path}`} />
      <Input type="file" className="mb-4" onChange={onProfileUpload} />

      <Input label="Name" value={auth.user.name} className="mb-4" readOnly />
      <Input label="Email" value={auth.user.email} className="mb-4" readOnly />

    </AppLayout>
  )
}

export default Profile;