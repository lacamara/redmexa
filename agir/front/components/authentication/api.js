import axios from "@agir/lib/utils/axios";

export const ENDPOINT = {
  login: "/api/connexion/",
  checkCode: "/api/connexion/code/",
  logout: "/api/deconnexion",
  signUp: "api/people/subscription/",
  getProfile: "/api/profil/",
  getProfileOptions: "/api/profil/",
  updateProfile: "/api/profil/",
};

export const login = async (email) => {
  const result = {
    success: false,
    error: null,
  };
  const url = ENDPOINT.login;
  const body = { email };
  try {
    const response = await axios.post(url, body);
    result.success = response.status === 200;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};

export const checkCode = async (code) => {
  const result = {
    success: false,
    error: null,
  };
  const url = ENDPOINT.checkCode;
  const body = { code };
  try {
    const response = await axios.post(url, body);
    result.success = response.status === 200;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};

export const logout = async () => {
  const result = {
    success: false,
    error: null,
  };
  const url = ENDPOINT.checkCode;
  try {
    const response = await axios.get(url);
    result.success = response.status === 200;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};

export const signUp = async (data) => {
  const result = {
    data: null,
    error: null,
  };
  const url = ENDPOINT.signUp;
  try {
    const response = await axios.post(url, data);
    result.data = response.data;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};

export const getProfile = async () => {
  const result = {
    data: null,
    error: null,
  };
  const url = ENDPOINT.getProfile;
  try {
    const response = await axios.get(url);
    result.data = response.data;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};

export const getProfileOptions = async () => {
  const result = {
    data: null,
    error: null,
  };
  const url = ENDPOINT.getProfileOptions;
  try {
    const response = await axios.options(url);
    result.data = response.data;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};

export const updateProfile = async (data) => {
  const result = {
    data: null,
    error: null,
  };
  const url = ENDPOINT.updateProfile;
  try {
    const response = await axios.patch(url, data);
    result.data = response.data;
  } catch (e) {
    result.error = (e.response && e.response.data) || e.message;
  }

  return result;
};
