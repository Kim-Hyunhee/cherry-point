import { IsNumber, IsString } from 'class-validator';

export class ReadPointDto {
  memberIdx: number;
  pageNum: number;
}

export class CreateMemberPointDto {
  @IsNumber()
  memberIdx: number;

  @IsString()
  pointCategory: string;

  @IsString()
  title: string;

  @IsString()
  pointType: string;

  @IsNumber()
  point: number;

  @IsNumber()
  memberPoint: number;
}

export class CreateGreenpDto {
  @IsString()
  memberIdx: number;

  @IsNumber()
  adsIdx: number;

  @IsString()
  adsName: string;

  @IsNumber()
  rwdCost: number;

  @IsString()
  adsReParticipate: string;
}

export class CreatePointDto {
  @IsNumber()
  memberIdx: number;

  @IsString()
  pointCategory: string;

  @IsString()
  title: string;

  @IsString()
  pointType: string;

  @IsNumber()
  point: number;
}
