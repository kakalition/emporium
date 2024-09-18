import { Head, router, usePage } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

function Otp() {
  const { appLogo, baseUrl, otp } = usePage().props
  console.log(otp);

  const [formState, setFormState] = useState({
    otp: '',
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
    router.post(`${baseUrl}/otp/${otp.id}`, formState);
  }

  function resendOtp(e) {
    router.post(`${baseUrl}/otp/${otp.id}/resend`);
  }

  return (
    <div className="flex h-screen flex-col justify-center px-8 lg:px-80 xl:px-[32rem]">
      <Head title="OTP Verification" />
      <img
        className="size-20 mb-8"
        src={appLogo}
      />

      <p className="mb-4 text-xl font-medium">
        OTP Verification
      </p>

      <form id="form" className="flex flex-col justify-center" onSubmit={handleSubmit}>
        <Input
          className="mb-2"
          name="email"
          value={otp.user.email}
          label="Email"
          type="text"
          readOnly
        />

        <Input
          className="mb-2"
          name="otp"
          value={formState.otp}
          onChange={onFormStateChange}
          label="OTP"
          type="text"
          isRequired
        />

        <Button
          className="mb-2"
          color="primary"
          type="submit"
        >
          Submit
        </Button>

        <Button
          color="default"
          type="button"
          onClick={resendOtp}
        >
          Resend OTP
        </Button>
      </form>
    </div>
  )
}

export default Otp;