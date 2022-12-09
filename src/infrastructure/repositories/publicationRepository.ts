import { type PrismaClient, type Publication } from '@prisma/index.d.ts';
import { injectable } from '@shared/packages/npm/inversify.package.ts';

import PublicationModel, {
	IImagePublication,
} from '@domain/models/publication.model.ts';

import { TitleVo } from '@domain/value_objects/title.vo.ts';
import { BodyVo } from '@domain/value_objects/Body.vo.ts';
import { IntVo } from '@domain/value_objects/int.vo.ts';
import { UUidVo } from '@domain/value_objects/uuid.vo.ts';
import { IntDateVo } from '@domain/value_objects/intData.vo.ts';

import { IPublicationEntity } from '@domain/models/publication.model.ts';

import {
	FindPublicationByCriteria,
	IPublicationRepository,
} from '@infrastructure/interfaces/publicationRepository.interface.ts';
import { prisma } from '@infrastructure/clients/prisma.client.ts';

export type IOrmPublicationDB = Publication;

export interface publicationRegister {
	uuid: string;
	title: string;
	body: string;
	image: IImagePublication;
	createdAt: Date;
	updatedAt: Date;
	likes: number;
	likesByUsers: UUidVo[];
	userId: string;
}

@injectable()
export class PublicationRepository implements IPublicationRepository {
	private _orm: PrismaClient;

	constructor() {
		this._orm = prisma;
	}

	protected adapterPublicationToDomain(
		ormPublication: IOrmPublicationDB
	): PublicationModel {
		const { body, uuid, image, likes, title, userId } = ormPublication;
		const likesByUser = [new UUidVo(uuid)];

		return new PublicationModel(
			new UUidVo(uuid),
			new TitleVo(title),
			new BodyVo(body),
			image,
			new IntDateVo(new Date()),
			new IntDateVo(new Date()),
			new IntVo(likes),
			likesByUser,
			new UUidVo(userId)
		);
	}

	protected adapterPublicationToOrm(
		domainPublication: IPublicationEntity
	): publicationRegister {
		const {
			body,
			uuid,
			image,
			likes,
			title,
			userId,
			createdAt,
			likesByUsers,
			updatedAt,
		} = domainPublication;
		return {
			body: body.value,
			createdAt: createdAt.value,
			image: image,
			likes: likes.value,
			title: title.value,
			uuid: uuid.value,
			likesByUsers: likesByUsers,
			updatedAt: updatedAt.value,
			userId: userId.value,
		};
	}

	// findByTitle({
	// 	publicationTitle,
	// }: {
	// 	publicationTitle: TitleVo;
	// }): FindPublicationByCriteria {
	//   const publicationFound = this._orm.publication.findUnique({
	//     where: {

	//     }
	//   })
	// }

	public async findByUUId({
		publicationUUId,
	}: {
		publicationUUId: UUidVo;
	}): FindPublicationByCriteria {
		const publicationFound = await this._orm.publication.findUnique({
			where: {
				id: publicationUUId.value,
			},
		});
		if (publicationFound == null) return null;
		return this.adapterPublicationToDomain(publicationFound);
	}

	public async findByUserUUId({
		userUUId,
	}: {
		userUUId: UUidVo;
	}): Promise<PublicationModel[] | null> {
		// change id for userId when prisma is updated with (prisma generate --data-proxy)
		const publicationFound = await this._orm.publication.findMany({
			where: {
				userId: userUUId.value,
			},
		});

		if (publicationFound == null) return null;
		return publicationFound.map(publication => {
			return this.adapterPublicationToDomain(publication);
		});
	}
}
