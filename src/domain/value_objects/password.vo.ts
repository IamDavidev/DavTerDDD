import { ValueObject } from '@domain/value_objects/valueObject.ts';
import { ValueObjectFormatException } from '@domain/errors/valueObjectFormat.exception.ts';
import {
	genSalt,
	hash as hashPassword,
} from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
import { compare as compareHashPassword } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
import { PlainPassword } from './plinPassword.vo.ts';

export class PasswordVo extends ValueObject<string> {
	constructor(value: string) {
		super(value);
	}

	public equals(vo: ValueObject<string>): boolean {
		if (this.value !== vo.value) return false;
		return true;
	}

	protected validate(): boolean {
		return true;
	}

	protected assertedIsValid(): void {}

	public static async create(password: string): Promise<PasswordVo> {
		if (password.length < 8 || password.length > 20 || password.includes(' '))
			throw new ValueObjectFormatException(PasswordVo.name, password);

		const HAS_SALT_ROUNDS = await genSalt(10);
		const hashedPassword = await hashPassword(password, HAS_SALT_ROUNDS);

		return new PasswordVo(hashedPassword);
	}

	public async compare(plainPassword: PlainPassword): Promise<boolean> {
		const isPasswordValid = await compareHashPassword(
			plainPassword.value,
			this.value
		);

		return isPasswordValid;
	}
}