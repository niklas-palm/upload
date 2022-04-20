import axios from "axios";

const API_URL =
  "https://cgyzpsvin6m6bbqnjc2574iknu0wzzev.lambda-url.eu-north-1.on.aws/";

export const getPresigned = async (file_type) => {
  const URL = API_URL + "?file=" + file_type;

  const { data, status } = await axios.get(URL);

  return data;
};
