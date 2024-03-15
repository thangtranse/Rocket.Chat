import { memo } from 'preact/compat';
import { withTranslation } from 'react-i18next';

import { createClassName } from '../../../helpers/createClassName';
import store from '../../../store';
import { likeIcon } from './icon';
import styles from './styles.scss';

const REACTION_API_ENDPOINT = {
	':thumbsup:': `${process.env.REACTION_MESSAGE_API_ENDPOINT}/feedback/reaction/thumbsup`,
	':thumbsdown:': `${process.env.REACTION_MESSAGE_API_ENDPOINT}/feedback/reaction/thumbsdown`,
};

const ReactionMessage = ({ reactions, mid, normal, inverted, className, style = {} }) => {
	console.log(store.state)
	const requestReactionMessage = (_mid, reactionType) => {
		const myHeaders = new Headers();
		myHeaders.append('Content-type', 'application/json');
		myHeaders.append('token', store.state.token || '');
		const raw = JSON.stringify({
			mid: _mid,
		});
		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow',
		};
		fetch(REACTION_API_ENDPOINT[reactionType], requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
	};

	const handleReactClick = (_mid, reactionType) => {
		requestReactionMessage(_mid, reactionType);
	};

	const renderReaction = (emojis) => {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
				<div onClick={() => handleReactClick(mid, ':thumbsup:')}>
					{likeIcon(emojis.filter(([emoji]) => emoji === ':thumbsup:').length ? 'rgb(40 112 215 / 78%)' : null)}
				</div>
				{` `}
				<div style={{ transform: `scale(-1)` }} onClick={() => handleReactClick(mid, ':thumbsdown:')}>
					{likeIcon(emojis.filter(([emoji]) => emoji === ':thumbsdown:').length ? 'rgb(40 112 215 / 78%)' : null)}
				</div>
			</div>
		);
	};

	return (
		<div className={createClassName(styles, 'reactions-message-wrapper')}>
			<div className={createClassName(styles, 'reactions-message', { normal, inverted }, [className])} style={style}>
				{renderReaction((reactions && Object.entries(reactions)) || [])}
			</div>
		</div>
	);
};

export default withTranslation()(memo(ReactionMessage));
