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
      const { idSession } = req.params;
      const { idMentor, idStudent } = req.body;

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

        const review = await SessionReviewModel.query().findOne({ idSession: idSession });

        if (review.idMentor !== idMentor || review.idStudent !== idStudent) {
          res.status(403).send({ error: "These users are not related to this session." })
          return;
        }
                
        if (review) {
          if (review.star === false) {
            await SessionReviewModel.query()
            .update({ 
              star: true
            })
            .where("idSession", idSession)
            .andWhere("idMentor", review.idMentor)
            .andWhere("idStudent", review.idStudent)
            
            res.send({ message: "Star updated to the mentor on this session !" });
            return;
          }

          res.status(409).send({ error: "You already gave a star to your mentor on this session !" })
          return;
        }

        await SessionReviewModel.query()
          .insert({ 
            idSession: idSession,
            idMentor: review.idMentor,
            idStudent: review.idStudent,
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
      const { idSession } = req.params;
      const { idMentor, idStudent } = req.body;

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

        const review = await SessionReviewModel.query().findOne({ idSession: idSession });

        if (review.idMentor !== idMentor || review.idStudent !== idStudent) {
          res.status(403).send({ error: "These users are not related to this session." })
          return;
        }
                
        if (review) {
          if (review.star === true) {
            await SessionReviewModel.query()
            .update({ 
              star: false
            })
            .where("idSession", idSession)
            .andWhere("idMentor", review.idMentor)
            .andWhere("idStudent", review.idStudent)
            
            res.send({ message: "Star updated to the mentor on this session !" });
            return;
          }

          res.status(409).send({ error: "Your mentor already don't have a star on this session !" })
          return;
        }

        await SessionReviewModel.query()
          .insert({ 
            idSession: idSession,
            idMentor: review.idMentor,
            idStudent: review.idStudent,
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