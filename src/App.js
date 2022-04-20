import axios from "axios";
import { Loading } from "@geist-ui/core";
import { useState } from "react";

import { getPresigned } from "./utils";

import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const getFileType = (files) => {
    let split = files[0].name.split(".");
    let file_type = split[split.length - 1];

    return file_type;
  };

  const onUploadClick = async (e) => {
    setStatusText("");
    let files = e.target.files;

    let file_type = getFileType(files); // Get the file suffix

    let presigned = await getPresigned(file_type); // Get presigned URL for upload

    const file = files[0];

    const formData = new FormData();

    Object.entries(presigned.fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", file); // The file has be the last element

    setLoading(true);

    const response = await axios.post(presigned.url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setLoading(false);

    if (response.status === 204) {
      setStatusText("Data has been successfully uploaded");
    } else {
      console.log("ERROR");
      setStatusText(response.statusText);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" id="file" name="file" onChange={onUploadClick} />
        {loading ? <Loading color="green" font="1.5em" /> : null}
        {statusText ? <p>{statusText}</p> : null}
      </header>
    </div>
  );
};

export default App;
