import React, {useState} from 'react'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './webhookURLForm.scss'
import RequestService from '../../services/request.service'
import { useParams } from 'react-router-dom'
import { SET_ALERT } from 'redux/types/active.types'
import { useActionless } from '../../redux/hooks'
import { apiUrl } from '../../config'

const webhookURLForm = () => {
    const [webhookURL, setWebhookURL] = useState<string>()
    const [webhookUrls, setWebhookUrls] = useState<string[]>([])
    const [watcherUrl, setWatcherUrl] = useState<string>()
    const { courseId } = useParams<{ courseId: string}>()
    const [setAlert] = useActionless(SET_ALERT)

    const handleUrlChange = (value: string) => {
        setWebhookURL(value);
    };

    const handleWatcherUrl = (value: string) => {
      setWatcherUrl(value);
    }

    const handleAddURL = () => {
        if (webhookURL) {
            //Handle adding webhook URL to backend here
            RequestService.post(`${apiUrl}/course/${courseId}/webhooks`, {
              "destinationUrl": webhookURL,
              "matcherUrl": watcherUrl
            }).then(
              _ => {
                setAlert({ autoDelete: true, type: 'success', message: 'Added webhook' })
                setWebhookUrls([...webhookUrls, webhookURL])
                // clear field
                setWebhookURL('')
                setWatcherUrl('')
              }
            ).catch(reason => {
                setAlert({ autoDelete: true, type: 'error', message: `Failed to add webhook ${reason.toString()}` })
            })
        }
    }

    return (
      <PageWrapper>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '30px'
        }} className = {styles.formBackground}>
          <TextField id="webhookURL" label={'Webhook URL'} onChange={handleUrlChange} sx={{ width: 1 / 2 }}
                     className={styles.textField}></TextField>
          <TextField id="matcherUrl" label={'Match URL'} helpText={"Url to watch for when sending the webhook "} onChange={handleWatcherUrl} sx={{ width: 1 / 2 }}
                     className={styles.textField}></TextField>
          <Button onClick={handleAddURL}>Add Webhook URL</Button>
        </div>

        <div className={styles.webhookURLContainer}>
          {webhookUrls.map((url, index) => (
            // <li key={index}>{url}</li>
            <div className={styles.webhookURLCard} key={index}>
                <div className={styles.webhookURLHeading}>{url}</div>
            </div>
          ))}
        </div>
      </PageWrapper>
    )
}

export default webhookURLForm