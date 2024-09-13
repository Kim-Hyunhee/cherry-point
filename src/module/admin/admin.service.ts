import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private repository: AdminRepository) {}

  async readAdmin({
    adminId,
    userName,
  }: {
    adminId?: number;
    userName?: string;
  }) {
    const admin = await this.repository.findAdmin({ id: adminId, userName });
    if (!admin) {
      throw new BadRequestException('There is no that admin');
    }

    return admin;
  }
}
