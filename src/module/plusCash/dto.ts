import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsIn } from 'class-validator';

const categories = ['save', 'place', 'product'] as const;
type Category = (typeof categories)[number];

export class CreatePlusCashLogDto {
  @ApiProperty({ description: '참여 완료 식별자' })
  @IsString()
  unique_key: string;

  @ApiProperty({ description: '유저(멤버) 아이디' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '참여 완료한 미션 이름' })
  @IsString()
  campaign_name: string;

  @ApiProperty({ description: '참여 완료한 미션 고유 아이디' })
  @IsString()
  campaign_id: string;

  @ApiProperty({
    description: '유저에게 지급할 리워드 + 매체에게 지급할 리워드',
  })
  @IsNumber()
  @Type(() => Number)
  reward: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  point: number;

  @ApiProperty({
    description:
      '참여한 미션 카테고리: place(장소미션), product(상품미션), save(저장미션)',
  })
  @IsIn(categories)
  category: Category;
}
