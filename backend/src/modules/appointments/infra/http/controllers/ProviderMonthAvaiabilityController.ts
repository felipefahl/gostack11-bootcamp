import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvaiabilityService from '@modules/appointments/services/ListProviderMonthAvaiabilityService';

export default class ProviderMonthAvaiabilityController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { provider_id } = request.params;
		const { year, month } = request.body;

		const listProviderMonthAvaiability = container.resolve(
			ListProviderMonthAvaiabilityService,
		);
		const appointment = await listProviderMonthAvaiability.execute({
			provider_id,
			year,
			month,
		});

		return response.json(appointment);
	}
}
