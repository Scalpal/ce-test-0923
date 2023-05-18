

const prepareStarsRoutes = ({ app, db }) => {
  app.post("/star/add", async (req, res) => {
    
    res.send({ message: "Star added "})
  }),

  app.delete("/star/remove", async (req, res) => {
    
    
    res.send({ message: "Star deleted " })
  })
}

export default prepareStarsRoutes; 