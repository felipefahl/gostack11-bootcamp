import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvaiabilityController from '../controllers/ProviderMonthAvaiabilityController';
import ProviderDayAvaiabilityController from '../controllers/ProviderDayAvaiabilityController';

const appointmentsRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvaiabilityController = new ProviderMonthAvaiabilityController();
const providerDayAvaiabilityController = new ProviderDayAvaiabilityController();

appointmentsRouter.use(ensureAuthenticated);
appointmentsRouter.get('/', providersController.index);
appointmentsRouter.get(
	'/:provider_id/month-avaiability',
	celebrate({
		[Segments.PARAMS]: {
			provider_id: Joi.string().uuid().required(),
		},
	}),
	providerMonthAvaiabilityController.index,
);
appointmentsRouter.get(
	'/:provider_id/day-avaiability',
	celebrate({
		[Segments.PARAMS]: {
			provider_id: Joi.string().uuid().required(),
		},
	}),
	providerDayAvaiabilityController.index,
);

export default appointmentsRouter;
