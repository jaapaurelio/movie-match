export async function pusherTrigger(pusher, channel, event, message) {
    return new Promise((resolve, reject) => {
      pusher.trigger(channel, event, message, (error, request, response) => {
        if (error) {
          reject(error)
        }
        // If no error, resolve with an object that 
        // contains the request + response details
        resolve({
          request,
          response
        })
      })
    })
  }

  