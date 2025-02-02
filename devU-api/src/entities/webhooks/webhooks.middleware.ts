import { NextFunction, Request, Response } from 'express'
import WebhooksService from './webhooks.service'
import fetch from 'node-fetch'


export async function processWebhook(statusCode: number, userId: number, path: string, body: any) {
  return new Promise(async (resolve, reject) => {
    try {
      // process path and check for match
      const hooks = await WebhooksService.retrieveByUserId(userId)
      if (hooks.length !== 0) {
        for (let hook of hooks) {
          // todo make matcher more generic that checks url patterns
          if (hook.matcherUrl == path) {
            try {
              // todo add multiple ways to format a webhook message currently only formated for discord
              const re = await fetch(hook.destinationUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'content': body }),
              })

              if (re.status >= 300) {
                reject(`Failed to send webhook ${re.statusText}`)
              }
            } catch (e) {
              reject(e)
            }
          }
        }
        // prepare request and send
      } else {
        reject('Url could not be matched')
      }

      resolve('Goodbye and thanks for all the fish')
    } catch (e) {
      reject(e)
    }
  })
}

// adds a
export function responseInterceptor(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send

  // Override function
  // @ts-ignore
  res.send = function(body) {
    // send response to client
    originalSend.call(this, body)

    // send body for processing in webhook
    if (req.currentUser?.userId) {
      processWebhook(res.statusCode, req.currentUser?.userId, req.originalUrl, body).then(
        value => {
          console.log('Sent webhook successfully')
        },
      ).catch(err => {
        console.warn('Error sending webhook', err)
      })
    }
  }
  next()
}
