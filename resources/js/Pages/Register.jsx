import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

function Register() {
  const { appLogo, baseUrl, errors } = usePage().props
  console.log(errors);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
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
    e.preventDefault();
    router.post(`${baseUrl}/register`, formState);
  }

  return (
    <div className="flex h-screen flex-col justify-center px-8 lg:px-80 xl:px-[32rem]">
      <Head title="Register" />
      <img
        className="size-20 mb-8"
        src={appLogo}
      />

      <p className="mb-4 text-xl font-medium">
        Register to Emporium
      </p>

      <form id="form" className="flex flex-col justify-center" onSubmit={handleSubmit}>
        <Input
          className="mb-2"
          errorMessage={errors.name}
          isInvalid={errors.name != null}
          name="name"
          value={formState.name}
          onChange={onFormStateChange}
          label="Name"
          type="text"
          isRequired
        />

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

        <Input
          className="mb-2"
          errorMessage={errors.password}
          isInvalid={errors.password != null}
          name="password_confirmation"
          value={formState.password_confirmation}
          onChange={onFormStateChange}
          label="Password Confirmation"
          type="password"
          isRequired
        />

        <Button
          className="mb-4"
          color="primary"
          type="submit"
        >
          Register
        </Button>
      </form>

      <p className="text-sm">
        Already have an account?&nbsp;
        <Link
          href="/login"
          className="cursor-pointer text-sm text-blue-700 underline"
        >
          Login
        </Link>
      </p>

    </div>
  )
}

export default Register;