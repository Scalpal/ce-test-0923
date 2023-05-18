import { integerValidator } from "../../validators.js";
import validate from "../middlewares/validate.js";
import SessionReviewModel from "../models/SessionReviewModel.js";
import UserModel from "../models/UserModel.js";

const prepareStarsRoutes = ({ app, db }) => {
  app.post(
    "/star/add",
    validate({
      body: {
        idMentor: integerValidator.required(),
        idStudent: integerValidator.required()
      }
    }),
    async (req, res) => {
      const idMentor = req.body.idMentor;
      const idStudent = req.body.idStudent; 

      try {
        const mentor = await UserModel.query().findOne({ id: idMentor });

        if (!mentor) {
          res.status(404).send({ error: "Mentor not found" })

          return; 
        }

        if (!mentor.isMentor) {
          res.status(403).send({ error: "Forbidden" });

          return; 
        }

        const student = await UserModel.query().findOne({ id: idStudent });

        if (!student) {
          res.status(404).send({ error: "student not found" })

          return; 
        }

        const review = await SessionReviewModel.query()
          .select("*")
          .where("idSession", 1)
          .andWhere("idMentor", idMentor)
          .andWhere("idStudent", idStudent)
                
        if (review.length) {
          if (review[0].star === false) {
            await SessionReviewModel.query()
            .update({ 
              star: true
            })
            .where("idSession", 1)
            .andWhere("idMentor", idMentor)
            .andWhere("idStudent", idStudent)
            
            res.send({ message: "Star updated to the mentor on this session !" });

            return;
          }

          res.status(409).send({ error: "You already gave a star to your mentor on this session !" })

          return;
        }

        await SessionReviewModel.query()
          .insert({ 
            idSession: 1,
            idMentor: idMentor,
            idStudent: idStudent,
            star: true
          })
          .returning("*")
        
        res.send({ message: "Star added to the mentor on this session !" });
        
      } catch (error) {
        console.log(error)
      }
  }),

  app.delete(
    "/star/remove",
    validate({
      body: {
        idMentor: integerValidator.required(),
        idStudent: integerValidator.required()
      }
    }),
    async (req, res) => {
      const idMentor = req.body.idMentor;
      const idStudent = req.body.idStudent; 

      try {
        const mentor = await UserModel.query().findOne({ id: idMentor });

        if (!mentor) {
          res.status(404).send({ error: "Mentor not found" })

          return; 
        }

        if (!mentor.isMentor) {
          res.status(403).send({ error: "Forbidden" });

          return; 
        }

        const student = await UserModel.query().findOne({ id: idStudent });

        if (!student) {
          res.status(404).send({ error: "student not found" })

          return; 
        }

        const review = await SessionReviewModel.query()
          .select("*")
          .where("idSession", 1)
          .andWhere("idMentor", idMentor)
          .andWhere("idStudent", idStudent)
                
        if (review.length) {
          if (review[0].star === true) {
            await SessionReviewModel.query()
            .update({ 
              star: false
            })
            .where("idSession", 1)
            .andWhere("idMentor", idMentor)
            .andWhere("idStudent", idStudent)
            
            res.send({ message: "Star updated to the mentor on this session !" });
            return;
          }

          res.status(409).send({ error: "Your mentor already don't have a star on this session !" })
          return;
        }

        await SessionReviewModel.query()
          .insert({ 
            idSession: 1,
            idMentor: idMentor,
            idStudent: idStudent,
            star: false
          })
          .returning("*")
        
        res.send({ message: "Star removed from the mentor on this session !" });
      } catch (error) {
        console.log(error)

        res.send({ error: "Error while deleting star. Retry." })
      }
  })
}

export default prepareStarsRoutes; 