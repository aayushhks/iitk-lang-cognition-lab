// Convert the data into an array of rows
const getRows = async () => {

  return await Promise.all(Object.entries(adMgmtData).map(async (item, idx) => {
    try {
      console.log(testing);
      return (
        <p>testing</p>
      )
    } catch (e) {
      console.log("Error generating row:", e);
      return (
        <p>testing</p>
      );
    }
  }));
};
