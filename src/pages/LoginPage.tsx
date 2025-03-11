import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../redux/features/auth/authApi";
import { toast } from "react-toastify";
import { verifyToken } from "../utils/verifyToken";
import {
  selectCurrentToken,
  setUser,
  TUser,
} from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { imageUpload } from "../utils/imageUpload";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email?.value;
    const password = form.password?.value;
    const name = form.name?.value;
    const image = form.image?.files[0];
    try {
      setLoading(true);
      if (isLogin) {
        const data = {
          email,
          password,
        };
        const res = await login(data).unwrap();
        if (res?.success) {
          toast.success(res?.message);
          navigate("/");
          const user = verifyToken(res.data.accessToken) as TUser;

          dispatch(setUser({ token: res.data.accessToken, user: user }));
        } else {
          toast.error(res?.message);
        }
      } else {
        const image_url = await imageUpload(image);
        const data = {
          name,
          email,
          password,
          profile_image: image_url,
        };
        const res = await register(data).unwrap();
        if (res?.success) {
          toast.success(res?.message);
          navigate("/");
          const user = verifyToken(res.data.accessToken) as TUser;

          dispatch(setUser({ token: res.data.accessToken, user: user }));
        } else {
          toast.error(res?.message);
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {/* Toggle Tabs */}
        <div className="flex justify-center mb-4 border-b">
          <button
            className={`w-1/2 py-2 text-lg font-medium ${
              isLogin
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-medium ${
              !isLogin
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label className="block text-gray-700">Profile Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={loading}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Footer Text */}
        <p className="mt-4 text-center text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
