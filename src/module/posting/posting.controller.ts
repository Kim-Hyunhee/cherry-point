import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreatePostingDto,
  ReadManyPostingDto,
  ModifyPostingDto,
  ReadManyHotPostingDto,
} from './dto';
import { PostingService } from './posting.service';
import { CommentService } from '../comment/comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMember } from 'src/decorators/currentMember.decorator';
import { tbl_member } from '@prisma/client';
import { HotPostingService } from '../hot-posting/hot-posting.service';

@ApiTags('posting')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('posting')
export class PostingController {
  constructor(
    private postingService: PostingService,
    private commentService: CommentService,
    private hotPostingService: HotPostingService,
  ) {}

  @Post()
  async postPosting(
    @Body() body: CreatePostingDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.postingService.createPosting({
      memberId: member.member_idx,
      ...body,
    });
  }

  @Get()
  async getManyPosting(
    @Query() { page, keyword, memberId }: ReadManyPostingDto,
    @CurrentMember() member: tbl_member,
  ) {
    const myTodayTotalPosting =
      await this.postingService.readMyTodayTotalPosting({
        memberId: member.member_idx,
      });

    const postings = await this.postingService.readManyPosting({
      page,
      keyword,
      memberId,
    });

    return { myTodayTotalPosting, ...postings };
  }

  @Get('/hot')
  async getManyHotPosting(@Query() { today }: ReadManyHotPostingDto) {
    return await this.hotPostingService.readTodayHotPosting({ today });
  }

  @Get('/today/hot')
  async getManyTodayHotPosting(@Query() { today }: ReadManyHotPostingDto) {
    return await this.postingService.readManyHotPosting({ today });
  }

  @Get(':id')
  async getPosting(
    @Param('id', ParseIntPipe) postingId: number,
    @CurrentMember() member: tbl_member,
  ) {
    const posting = await this.postingService.readPosting({ postingId });

    this.postingService.createMemberPostingHit({
      memberId: member.member_idx,
      postingId,
    });

    return posting;
  }

  @Put(':id')
  async putPosting(
    @Param('id', ParseIntPipe) postingId: number,
    @Body() body: ModifyPostingDto,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.postingService.modifyPosting({
      postingId,
      memberId: member.member_idx,
      ...body,
    });
  }

  @Delete(':id')
  async deletePosting(
    @Param('id', ParseIntPipe) postingId: number,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.postingService.removePosting({
      postingId,
      memberId: member.member_idx,
    });
  }

  @Get(':id/comment')
  async getManyComment(@Param('id', ParseIntPipe) postingId: number) {
    return await this.commentService.readManyComment({ postingId });
  }

  @Post(':id/like')
  async postMemberPostingLike(
    @Param('id', ParseIntPipe) postingId: number,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.postingService.createMemberPostingLike({
      postingId,
      memberId: member.member_idx,
    });
  }

  @Delete(':id/like')
  async deleteMemberPostingLike(
    @Param('id', ParseIntPipe) postingId: number,
    @CurrentMember() member: tbl_member,
  ) {
    return await this.postingService.removeMemberPostingLike({
      postingId,
      memberId: member.member_idx,
    });
  }
}
