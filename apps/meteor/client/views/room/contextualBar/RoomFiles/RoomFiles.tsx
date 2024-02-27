import type { IUpload, IUploadWithUser } from '@rocket.chat/core-typings';
import type { SelectOption } from '@rocket.chat/fuselage';
import { Box, Icon, TextInput, Select, Throbber, Margins } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { FormEvent } from 'react';
import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import {
	ContextualbarHeader,
	ContextualbarIcon,
	ContextualbarTitle,
	ContextualbarClose,
	ContextualbarContent,
	ContextualbarEmptyContent,
} from '../../../../components/Contextualbar';
import ScrollableContentWrapper from '../../../../components/ScrollableContentWrapper';
import FileItem from './components/FileItem';

type RoomFilesProps = {
	loading: boolean;
	type: string;
	text: string;
	filesItems: IUploadWithUser[];
	loadMoreItems: (start: number, end: number) => void;
	setType: (value: any) => void;
	setText: (e: FormEvent<HTMLElement>) => void;
	total: number;
	onClickClose: () => void;
	onClickDelete: (id: IUpload['_id']) => void;
};

const RoomFiles = ({
	loading,
	type,
	text,
	filesItems = [],
	loadMoreItems,
	setType,
	setText,
	total,
	onClickClose,
	onClickDelete,
}: RoomFilesProps) => {
	const t = useTranslation();

	const options: SelectOption[] = useMemo(
		() => [
			['all', t('All')],
			['image', t('Images')],
			['video', t('Videos')],
			['audio', t('Audios')],
			['text', t('Texts')],
			['application', t('Files')],
		],
		[t],
	);

	return (
		<>
			<ContextualbarHeader>
				<ContextualbarIcon name='attachment' />
				<ContextualbarTitle>{t('Files')}</ContextualbarTitle>
				{onClickClose && <ContextualbarClose onClick={onClickClose} />}
			</ContextualbarHeader>
			<ContextualbarContent paddingInline={0}>
				<Box display='flex' flexDirection='row' p={24} flexShrink={0}>
					<Box display='flex' flexDirection='row' flexGrow={1} mi='neg-x4'>
						<Margins inline='x4'>
							<TextInput
								data-qa-files-search
								placeholder={t('Search_Files')}
								value={text}
								onChange={setText}
								addon={<Icon name='magnifier' size='x20' />}
							/>
							<Box w='x144' mis={8}>
								<Select onChange={setType} value={type} options={options} />
							</Box>
						</Margins>
					</Box>
				</Box>
				{loading && (
					<Box p={24}>
						<Throbber size='x12' />
					</Box>
				)}
				{!loading && filesItems.length === 0 && <ContextualbarEmptyContent title={t('No_files_found')} />}
				{!loading && filesItems.length > 0 && (
					<Box w='full' h='full' flexShrink={1} overflow='hidden'>
						<Virtuoso
							style={{
								height: '100%',
								width: '100%',
							}}
							totalCount={total}
							endReached={(start) => loadMoreItems(start, Math.min(50, total - start))}
							overscan={50}
							data={filesItems}
							components={{ Scroller: ScrollableContentWrapper }}
							itemContent={(_, data) => <FileItem fileData={data} onClickDelete={onClickDelete} />}
						/>
					</Box>
				)}
			</ContextualbarContent>
		</>
	);
};

export default RoomFiles;
