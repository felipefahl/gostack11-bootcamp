import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvaiabilityService from '@modules/appointments/services/ListProviderDayAvaiabilityService';

export default class ProviderDayAvaiabilityController {
	public async index(request: Request, response: Response): Promise<Response> {
		const { provider_id } = request.params;
		const { year, month, day } = request.body;

		const listProviderDayAvaiability = container.resolve(
			ListProviderDayAvaiabilityService,
		);

		const appointment = await listProviderDayAvaiability.execute({
			provider_id,
			year,
			month,
			day,
		});

		return response.json(appointment);
	}
}
