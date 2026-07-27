package com.uoc.lostandfound.repository;

import com.uoc.lostandfound.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}