package com.uoc.lostandfound.repository;

import com.uoc.lostandfound.model.FeedbackReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackReportRepository
        extends JpaRepository<FeedbackReport, Long> {
}
