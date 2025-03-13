import { useState } from "react";
import {
  useGetUserQuery,
  useUpdateProfileMutation,
} from "../redux/features/auth/authApi";
import { Link } from "react-router";
import { imageUpload } from "../utils/imageUpload";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [image, setImage] = useState<File | null>(null);
  const { data, isLoading, isFetching } = useGetUserQuery(undefined);
  const user = data?.data || {};

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  if (isLoading || isFetching) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl font-medium">Loading....</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const name = form?.name?.value;
    let profile_image = user?.profile_image;
    try {
      if (image !== null) {
        profile_image = await imageUpload(image);
      }
      const data = {
        name,
        profile_image,
      };

      const res = await updateProfile(data).unwrap();
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white p-6 rounded-lg shadow-md w-96 text-center"
      >
        <label className="block relative cursor-pointer">
          <img
            src={user?.profile_image}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full object-cover"
          />
        </label>
        <div className="mt-8">
          <label className="block text-left text-gray-600 font-medium">
            Change Profile Image
          </label>
          <input
            onChange={(e) => {
              e.target.files && setImage(e.target.files[0]);
            }}
            type="file"
            className="border py-2 rounded-md"
          />
        </div>

        <div className="mt-4">
          <label className="block text-left text-gray-600 font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user?.name}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mt-4">
          <label className="block text-left text-gray-600 font-medium">
            Email
          </label>
          <input
            type="email"
            defaultValue={user?.email}
            readOnly
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-400 py-3 rounded-lg mt-6 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isUpdating}
        >
          Update Profile
        </button>
        <Link to="/">
          <button
            type="button"
            className="w-full bg-orange-400 py-3 rounded-lg mt-3 text-white"
          >
            Back To Messenger
          </button>
        </Link>
      </form>
    </div>
  );
};

export default ProfilePage;
