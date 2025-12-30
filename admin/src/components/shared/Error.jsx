export const Error = (error) => {
  if (!error) return null;
  return (
    <p className=" text-center  p-5 font-bold text-red-500">
      failed to loading teacher
    </p>
  );
};
