import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import appointmentsRouter from './appoitments.routes';
import sessionsRouter from './sessions.routes';
import usersRouter from './users.routes';

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
