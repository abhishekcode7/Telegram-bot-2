import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
const BotSettings = () => {
  const [key,setKey] = useState("")

  const updateBotApiKey =(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      axios
      .post("/api/updateKey", {
        key: key,
      })
      .then((res) => {
        console.log(res);
        if (res.data == true) {
          alert("Successfully");
        } else {
          alert("Failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
      setKey("");
  }



  return (
    <>
      <Form  onSubmit={(e)=>{updateBotApiKey(e)}}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Bot Api Key</Form.Label>
          <Form.Control type="text" onChange={(e)=> setKey(e.target.value)} value={key}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </>
  );
};

export default BotSettings;
