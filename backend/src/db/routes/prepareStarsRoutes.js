import { integerValidator } from "../../validators.js";
import validate from "../middlewares/validate.js";
import SessionModel from "../models/SessionModel.js";
import SessionReviewModel from "../models/SessionReviewModel.js";
import UserModel from "../models/UserModel.js";

const prepareStarsRoutes = ({ app, db }) => {
  app.post(
    "/star/add/:idSession",
    validate({
      params: { 
        idSession: integerValidator.required()
      },
      body: {
        idMentor: integerValidator.required(),
        idStudent: integerValidator.required()
      }
    }),
    async (req, res) => {
      const idSession = req.params.idSession;
      const idMentor = req.body.idMentor;
      const idStudent = req.body.idStudent; 

      try {
        const session = await SessionModel.query().findOne({ id: idSession })

        if (!session) {
          res.status(404).send({ error: "Session not found" })
          return; 
        }

        const mentor = await UserModel.query().findOne({ id: idMentor });

        if (!mentor) {
          res.status(404).send({ error: "Mentor not found" })
          return; 
        }

        if (!mentor.isMentor) {
          res.status(403).send({ error: "This user is not a mentor." });
          return; 
        }

        const student = await UserModel.query().findOne({ id: idStudent });

        if (!student) {
          res.status(404).send({ error: "Student not found" })
          return; 
        }

        const review = await SessionReviewModel.query()
          .select("*")
          .where("idSession", idSession)

        if (review[0].idMentor !== idMentor || review[0].idStudent !== idStudent) {
          res.status(403).send({ error: "These users are not related to this session." })
          return;
        }
                
        if (review.length) {
          if (review[0].star === false) {
            await SessionReviewModel.query()
            .update({ 
              star: true
            })
            .where("idSession", idSession)
            .andWhere("idMentor", review[0].idMentor)
            .andWhere("idStudent", review[0].idStudent)
            
            res.send({ message: "Star updated to the mentor on this session !" });
            return;
          }

          res.status(409).send({ error: "You already gave a star to your mentor on this session !" })
          return;
        }

        await SessionReviewModel.query()
          .insert({ 
            idSession: idSession,
            idMentor: review[0].idMentor,
            idStudent: review[0].idStudent,
            star: true
          })
          .returning("*")
        
        res.send({ message: "Star added to the mentor on this session !" });
        
      } catch (error) {
        console.log(error)
      }
  }),

  app.delete(
    "/star/remove/:idSession",
    validate({
      params: {
        idSession: integerValidator.required()
      },
      body: {
        idMentor: integerValidator.required(),
        idStudent: integerValidator.required()
      }
    }),
    async (req, res) => {
      const idSession = req.params.idSession; 
      const idMentor = req.body.idMentor;
      const idStudent = req.body.idStudent; 

      try {
        const session = await SessionModel.query().findOne({ id: idSession })

        if (!session) {
          res.status(404).send({ error: "Session not found" })
          return; 
        }

        const mentor = await UserModel.query().findOne({ id: idMentor });

        if (!mentor) {
          res.status(404).send({ error: "Mentor not found" })
          return; 
        }

        if (!mentor.isMentor) {
          res.status(403).send({ error: "This user is not a mentor." });
          return; 
        }

        const student = await UserModel.query().findOne({ id: idStudent });

        if (!student) {
          res.status(404).send({ error: "Student not found" })
          return; 
        }

        const review = await SessionReviewModel.query()
          .select("*")
          .where("idSession", idSession)

        if (review[0].idMentor !== idMentor || review[0].idStudent !== idStudent) {
          res.status(403).send({ error: "These users are not related to this session." })
          return;
        }
                
        if (review.length) {
          if (review[0].star === true) {
            await SessionReviewModel.query()
            .update({ 
              star: false
            })
            .where("idSession", idSession)
            .andWhere("idMentor", review[0].idMentor)
            .andWhere("idStudent", review[0].idStudent)
            
            res.send({ message: "Star updated to the mentor on this session !" });
            return;
          }

          res.status(409).send({ error: "Your mentor already don't have a star on this session !" })
          return;
        }

        await SessionReviewModel.query()
          .insert({ 
            idSession: idSession,
            idMentor: review[0].idMentor,
            idStudent: review[0].idStudent,
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