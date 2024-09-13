import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { ReadEventDto } from './dto';
import { dateToSqlDateTime } from 'src/common/helper';

@Injectable()
export class EventService {
  constructor(private repository: EventRepository) {}

  async readEvents({ data }: { data: ReadEventDto }) {
    let title = undefined;
    let subtitle = undefined;

    if (data.title) {
      title = data.title.trim();
    }

    if (data.subtitle) {
      subtitle = data.subtitle.trim();
    }

    let startDateStart = undefined;
    let startDateEnd = undefined;
    let endDateStart = undefined;
    let endDateEnd = undefined;
    let insDateStart = undefined;
    let insDateEnd = undefined;

    if (data.startDateStart) {
      startDateStart = dateToSqlDateTime(new Date(data.startDateStart));
    }

    if (data.startDateEnd) {
      startDateEnd = dateToSqlDateTime(new Date(data.startDateEnd));
    }

    if (data.endDateStart) {
      endDateStart = dateToSqlDateTime(new Date(data.endDateStart));
    }

    if (data.endDateEnd) {
      endDateEnd = dateToSqlDateTime(new Date(data.endDateEnd));
    }

    if (data.insDateStart) {
      insDateStart = dateToSqlDateTime(new Date(data.insDateStart));
    }

    if (data.insDateEnd) {
      insDateEnd = dateToSqlDateTime(new Date(data.insDateEnd));
    }

    return await this.repository.findEvents({
      data: {
        title,
        subtitle,
        state: data.state,
        startDateStart,
        startDateEnd,
        endDateStart,
        endDateEnd,
        insDateStart,
        insDateEnd,
      },
    });
  }

  async readEventsWithFilter({ data }: { data: ReadEventDto }) {
    let title = undefined;
    let subtitle = undefined;

    if (data.title) {
      title = data.title.trim();
    }

    if (data.subtitle) {
      subtitle = data.subtitle.trim();
    }

    let startDateStart = undefined;
    let startDateEnd = undefined;
    let endDateStart = undefined;
    let endDateEnd = undefined;
    let insDateStart = undefined;
    let insDateEnd = undefined;

    if (data.startDateStart) {
      startDateStart = dateToSqlDateTime(new Date(data.startDateStart));
    }

    if (data.startDateEnd) {
      startDateEnd = dateToSqlDateTime(new Date(data.startDateEnd));
    }

    if (data.endDateStart) {
      endDateStart = dateToSqlDateTime(new Date(data.endDateStart));
    }

    if (data.endDateEnd) {
      endDateEnd = dateToSqlDateTime(new Date(data.endDateEnd));
    }

    if (data.insDateStart) {
      insDateStart = dateToSqlDateTime(new Date(data.insDateStart));
    }

    if (data.insDateEnd) {
      insDateEnd = dateToSqlDateTime(new Date(data.insDateEnd));
    }

    return await this.repository.findEventsWithPageNation({
      page: data.page,
      data: {
        title,
        subtitle,
        state: data.state,
        startDateStart,
        startDateEnd,
        endDateStart,
        endDateEnd,
        insDateStart,
        insDateEnd,
      },
    });
  }
}
