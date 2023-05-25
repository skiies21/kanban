import React, { useEffect } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Record } from 'PersonalKanban/types';
import IconButton from 'PersonalKanban/components/IconButton';
import { Button, TextField } from '@material-ui/core';
import { RecordContext } from '../../containers/KanbanBoard';

const useStyles = makeStyles(() => ({
    paper: {
        height: 219,
    },
    description: {
        minHeight: '5rem',
        display: '-webkit-box',
        '-webkit-line-clamp': 4,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        whiteSpace: 'pre-line',
    },
noBorder: {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
                border: 'none',
            },
    },
}))

type CardProps = {
    record: Record
    className?: string
    style?: any
    innerRef?: any
    showEditAction?: boolean
    showDeleteAction?: boolean
    onDelete?: any
    onEdit?: any
}

const Card: React.FC<CardProps> = (props) => {
    const { handleRecordHours, justAddedTime } = React.useContext(RecordContext)

    const {
        record,
        className,
        innerRef,
        style,
        showEditAction,
        showDeleteAction,
        onDelete,
        onEdit,
        ...rest
    } = props
    const { title, description, createdAt } = record

    const classes = useStyles()
    const handleEdit = React.useCallback(() => {
        onEdit(record)
    }, [record, onEdit])

    const handleDelete = React.useCallback(
        () => onDelete(record),
        [record, onDelete]
    )

    const [hoursState, setHoursState] = React.useState<number>(0)

    const handleHoursState = React.useCallback(
        (e) => {
            if (e.target.value >= 0) {
                setHoursState(e.target.value)
            }
        },
        []
    )

    const handleHoursAdd = () => {
        if (Number(hoursState) < 0) return
        handleRecordHours(title, Number(hoursState))
        setHoursState(0)
    }

    const getRecordValue = (idRecord: string) => {
        const record = justAddedTime?.find((item) => item.idRecord === idRecord)
        return record ? record.hours : '--'
    }

    useEffect(() => {
        //console.log('render_card', record)
    }, [])

    return (
        <Paper
            className={clsx(classes.paper, className)}
            style={{
                ...style,
                ...{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'spaceBetween',
                },
            }}
            ref={innerRef}
            {...rest}
        >
            <Box display="flex">
                <Typography
                    title={title}
                    gutterBottom
                    noWrap
                    style={{ marginRight: 12 }}
                >
                    <b>ID:{title}</b>
                </Typography>
                <Typography>
                    <b>( {record.nameProject} )</b>
                </Typography>
                <Box display="flex" alignItems="center">
                    {showEditAction && (
                        <IconButton icon="edit" onClick={handleEdit} />
                    )}
                    {showDeleteAction && (
                        <IconButton
                            icon="deleteForever"
                            onClick={handleDelete}
                        />
                    )}
                </Box>
            </Box>
{/*
            <Typography
                title={description}
                className={classes.description}
                style={{ flex: 1, fontWeight: 700 }}
                variant="body2"
                gutterBottom
            >
*/}
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="spaceBetween"
                >        	
                    <Box display="flex" flexDirection="column">
                        {description}
                        <Box display="flex" alignItems="center">
                            <TextField
                                id="outlined-name"
                                label="Время"
                                type={'number'}
                                value={hoursState}
                                style={{ width: '30%', marginRight: 14 }}
                                onChange={handleHoursState}
                            />
                            <Box display="flex" flexDirection="row">
                                <Button
                                    style={{
                                        background: 'rgb(242 108 108)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        // padding: '1em',
                                        left: '-15px',
                                        margin: '8px',
                                        height: 40,
                                        width: 80,
                                        top: '2px',
                                        textTransform: 'none',
                                    }}
                                    onClick={() => handleHoursAdd()}
                                >
                                    Добавить к {record.hours}
                                </Button>
                                </Box>
<TextField
                                id="justAdded"
                                label="Посл. доб"
                                type="text"
                                value={getRecordValue(record.title)}
                                focused
                                inputProps={{
                                    readOnly: true,
                                //  disableUnderline: true,
                                }}
                                style={{
                                    width: '30%',
                                }}
                                className={classes.noBorder}
                            />                               
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" gridRowGap={5}>
                    <Box display="flex" flex={1} gridColumnGap={4}>
                        {record.estimated_time ? (
                            <>
                                <Typography style={{ fontSize: 12 }}>
                                    Предполагаемое время
                                </Typography>
                                <Typography
                                    style={{
                                        fontWeight: 600,
                                        color: 'gray',
                                        fontSize: 12,
                                    }}
                                >
                                    {record.estimated_time} ч
                                </Typography>
                            </>
                        ) : null}
                    </Box>
                    {record.start_date || record.end_date ? (
                        <Typography component="p" style={{ fontSize: 12 }}>
                            Дата{' '}
                            {
                                <span
                                    style={{ fontWeight: 600, color: 'gray' }}
                                >
                                    {record.start_date || ''} —{' '}
                                    <span style={{ color: 'red' }}>
                                        {record.end_date || ''}
                                    </span>
                                </span>
                            }
                        </Typography>
                    ) : null}
                </Box>
{/*
            </Typography>
*/}
            <Typography component="p" variant="caption" noWrap>
                {createdAt}
            </Typography>
            {record.author ? (
                <Typography component="p" variant="caption" noWrap>
                    Автор: {record.author}
                </Typography>
            ) : null}
            <Typography component="p" style={{ fontSize: 12 }}>
                Изменено {record.changedDate}
            </Typography>
        </Paper>
    )
}

Card.defaultProps = {
    showDeleteAction: false,
    showEditAction: false,
}

export default Card