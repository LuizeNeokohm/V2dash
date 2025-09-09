import { useState } from "react";

export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const setError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const validate = (requiredFields = []) => {
    let newErrors = {};
    requiredFields.forEach((field) => {
      if (!values[field] || values[field].toString().trim() === "") {
        newErrors[field] = "Campo obrigatório";
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setErrorMessage("");
  };

  return {
    values,
    errors,
    errorMessage,
    handleChange,
    validate,
    resetForm,
    setError, // ⚡ aqui está o fix
  };
}
