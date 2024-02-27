import type { IOTRMessage } from '@rocket.chat/core-typings';
import type { ServerMethods } from '@rocket.chat/ui-contexts';
import { Meteor } from 'meteor/meteor';

import notifications from '../../../notifications/server/lib/Notifications';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		updateOTRAck({ message, ack }: { message: IOTRMessage; ack: string }): void;
	}
}

Meteor.methods<ServerMethods>({
	updateOTRAck({ message, ack }) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateOTRAck' });
		}
		const acknowlegedMessage: IOTRMessage = { ...message, otrAck: ack };
		notifications.streamRoomMessage.emit(message.rid, acknowlegedMessage);
	},
});
