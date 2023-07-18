import Swal from "sweetalert2";
export const successMessage = (message) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: `${message}`,
    showConfirmButton: false,
    timer: 1500,
  });
};
export const errorMessage = (message) => {
  Swal.fire({
    position: "center",
    icon: "error",
    title: `${message}`,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const symbol = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  HUF: "Ft",
};
