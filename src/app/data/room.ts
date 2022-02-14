import { BookingDto } from '../model/bookingdto';
import { RoomDto } from '../model/roomdto';

export class RoomData {

    getAllRoom(): RoomDto[] {
        const r = new Array<RoomDto>();
        let room: RoomDto;

        room = new RoomDto();
        room.roomId = 1;
        room.roomNumber = '100';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 2;
        room.roomNumber = '101';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 3;
        room.roomNumber = '102';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 4;
        room.roomNumber = '104';
        room.roomType = 2;
        room.roomTypeName = 'Double';
        r.push(room);
        room = new RoomDto();
        room.roomId = 5;
        room.roomNumber = '105';
        room.roomType = 2;
        room.roomTypeName = 'Double';
        r.push(room);

        room = new RoomDto();
        room.roomId = 6;
        room.roomNumber = '200';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 7;
        room.roomNumber = '201';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 8;
        room.roomNumber = '202';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 9;
        room.roomNumber = '204';
        room.roomType = 2;
        room.roomTypeName = 'Double';
        r.push(room);
        room = new RoomDto();
        room.roomId = 10;
        room.roomNumber = '205';
        room.roomType = 2;
        room.roomTypeName = 'Double';
        r.push(room);

        room = new RoomDto();
        room.roomId = 11;
        room.roomNumber = '300';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 12;
        room.roomNumber = '301';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 13;
        room.roomNumber = '302';
        room.roomType = 1;
        room.roomTypeName = 'Single';
        r.push(room);
        room = new RoomDto();
        room.roomId = 14;
        room.roomNumber = '304';
        room.roomType = 2;
        room.roomTypeName = 'Double';
        r.push(room);
        room = new RoomDto();
        room.roomId = 15;
        room.roomNumber = '305';
        room.roomType = 2;
        room.roomTypeName = 'Double';
        r.push(room);

        return r;
    }

    getAllBooking(bookings): BookingDto[] {
        if (bookings) {
            return bookings;
        }
        const b = new Array<BookingDto>();
        bookings = b;

        let index = 1;
        for (let y = 2018; y < 2019; ++y) {
            for (let m = 0; m < 12; ++m) {
                if ((m % 2) === 1) {
                    this.createBokingDto1(b, y, m, index);
                } else {
                    this.createBokingDto2(b, y, m, index);
                }
                index = index + 13;
            }
        }

        return b;
    }

    private createBokingDto1(b, y, m, bid) {
        let booking: BookingDto;

        booking = new BookingDto();
        booking.bookingId = bid;
        booking.roomId = 1;
        booking.roomType = 1;
        booking.startDate = new Date(y, m, 5);
        booking.endDate = new Date(y, m, 10);
        booking.stayDay = 5;
        booking.name = 'personA-' + booking.bookingId;
        // b.push(booking);
    }

    private createBokingDto2(b, y, m, bid) {
        let booking: BookingDto;

        booking = new BookingDto();
        booking.bookingId = bid;
        booking.roomId = 4;
        booking.roomType = 2;
        booking.startDate = new Date(y, m, 5);
        booking.endDate = new Date(y, m, 10);
        booking.stayDay = 5;
        booking.name = 'personB-' + booking.bookingId;
        // b.push(booking);
    }
}
