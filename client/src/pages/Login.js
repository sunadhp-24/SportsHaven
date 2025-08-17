import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/api";
import { setLogin } from "../redux/UserSlice";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/outline";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosInstance.post("/users/login", values);

      if (response.status === 200) {
        dispatch(setLogin(response.data));
        resetForm();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Login
        </h2>
        {showSuccess && (
          <div className="flex items-center justify-center bg-green-500 text-white p-4 mb-4 rounded-lg">
            <CheckCircleIcon className="w-6 h-6 mr-2" />
            Login Successful
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {touched.username && errors.username && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.username}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {touched.password && errors.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            New User?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
