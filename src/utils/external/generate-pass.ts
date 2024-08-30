const URL = "https://papillon-pass-api.vercel.app/api/generate-pass";

interface GeneratePassData {
  name: string;
  classe: string;
  service: string;
  data: string;
  type: string;
  encoding: string;
}

export const generatePass = async (data: GeneratePassData) => {
  const response = await fetch(`${URL}?name=${data.name}&classe=${data.classe}&service=${data.service}&type=${data.type}&data=${data.data}&encoding=${data.encoding}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

