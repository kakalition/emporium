import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

function Login() {
  const { appLogo, baseUrl, errors } = usePage().props
  console.log(errors);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  function onFormStateChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.post(`${baseUrl}/login`, formState);
  }

  return (
    <div className="flex h-screen flex-col justify-center px-8 lg:px-80 xl:px-[32rem]">
      <Head title="Login" />
      <img
        className="size-20 mb-8"
        src={appLogo}
      />

      <p className="mb-4 text-xl font-medium">
        Login to Emporium
      </p>

      <form id="form" className="flex flex-col justify-center" onSubmit={handleSubmit}>
        <Input
          className="mb-2"
          errorMessage={errors.email}
          isInvalid={errors.email != null}
          name="email"
          value={formState.email}
          onChange={onFormStateChange}
          label="Email"
          type="email"
          isRequired
        />

        <Input
          className="mb-2"
          errorMessage={errors.password}
          isInvalid={errors.password != null}
          name="password"
          value={formState.password}
          onChange={onFormStateChange}
          label="Password"
          type="password"
          isRequired
        />

        <Button
          className="mb-4"
          color="primary"
          type="submit"
        >
          Login
        </Button>
      </form>

      <p className="text-sm">
        Don't have an account yet?&nbsp;
        <Link
          href="/register"
          className="cursor-pointer text-sm text-blue-700 underline"
        >
          Register
        </Link>
      </p>

    </div>
  )
}

export default Login;