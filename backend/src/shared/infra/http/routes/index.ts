import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appoitments.routes';
import sessionsRouter from '@shared/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

const authenticatedRoutes = [
	{
		name: '/appointments',
		route: appointmentsRouter,
	},
];

authenticatedRoutes.forEach(authenticatedRoute => {
	routes.use(
		authenticatedRoute.name,
		ensureAuthenticated,
		authenticatedRoute.route,
	);
});

// routes.use('/appointments', appointmentsRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);

export default routes;
