import React from 'react';
import Drawer from '@mui/material/Drawer';

import MailchimpSubscribe from "react-mailchimp-subscribe"
import { Input } from '@mui/material';
import Button from '../Button/Button';

const url = "https://barofdreams.us19.list-manage.com/subscribe/post?u=4da6609cb05e59606e3f1e5fa&amp;id=dc603694bd&amp;f_id=000e8ce4f0";

// use the render prop and your custom form
export default function EmailListSignUp() {
  return <MailchimpSubscribe
  url={url}
  render={({ subscribe, status, message }) => (
      <CustomForm
        status={status}
        message={message}
        onValidated={formData => subscribe(formData)}
      />
    )}
  />
}

// a basic form
const CustomForm = ({ status, message, onValidated }) => {
  let email, name;
  const submit = () =>
    email &&
    name &&
    email.value.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email.value,
      NAME: name.value
    });

  return (
    <div className="EmailListSignUp">
      {status === "sending" && <div>sending...</div>}
      {status === "error" && (
        <div
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <Input
        ref={node => (name = node)}
        type="text"
        placeholder="Your name"
      />
      <Input
        ref={node => (email = node)}
        type="email"
        placeholder="Your email"
      />
      <Button style={{ fontSize: "2em", padding: 5 }} onClick={submit}>
        Submit
      </Button>
    </div>
  );
};
