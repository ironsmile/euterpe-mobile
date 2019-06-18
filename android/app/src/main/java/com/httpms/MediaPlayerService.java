package com.httpms;

import android.app.Service;
import android.app.PendingIntent;
import android.app.Notification;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.os.HandlerThread;
import android.os.Process;
import android.os.Looper;
import android.os.IBinder;
import android.widget.Toast;

public class MediaPlayerService extends Service {
	private int ONGOING_NOTIFICATION_ID = 42;
	private Looper serviceLooper;
	private ServicePlayer servicePlayer;

	private final class ServicePlayer extends Handler {
		public ServicePlayer(Looper looper) {
			super(looper);
		}

		@Override
		public void handleMessage(Message msg) {
			try {
				Thread.sleep(20000);
			} catch (InterruptedException e) {
				// Restore interrupt status.
				Thread.currentThread().interrupt();
			}

			stopSelf(msg.arg1);
		}
	}

	@Override
	public void onCreate() {
		HandlerThread thread = new HandlerThread("ServiceStartArguments",
				Process.THREAD_PRIORITY_BACKGROUND);
		thread.start();

		serviceLooper = thread.getLooper();
		servicePlayer = new ServicePlayer(serviceLooper);

		Intent notificationIntent = new Intent(this, MediaPlayerService.class);
		PendingIntent pendingIntent =
				PendingIntent.getActivity(this, 0, notificationIntent, 0);

		Notification notification =
				new Notification.Builder(this)
			.setContentTitle("HTTPMS Media Service")
			.setContentText("music playing in background")
			.setContentIntent(pendingIntent)
			.build();

		startForeground(ONGOING_NOTIFICATION_ID, notification);
	}


	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Toast.makeText(this, "service starting", Toast.LENGTH_SHORT).show();

		// For each start request, send a message to start a job and deliver the
		// start ID so we know which request we're stopping when we finish the job
		Message msg = servicePlayer.obtainMessage();
		msg.arg1 = startId;
		servicePlayer.sendMessage(msg);

		// If we get killed, after returning from here, restart
		return START_STICKY;
	}

	@Override
	public IBinder onBind(Intent intent) {
		// We don't provide binding, so return null
		return null;
	}


	@Override
	public void onDestroy() {
		Toast.makeText(this, "service done", Toast.LENGTH_SHORT).show();
	}

}
