package com.uoc.lostandfound.service;

import com.uoc.lostandfound.model.FeedbackReport;
import com.uoc.lostandfound.repository.FeedbackReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackReportService {

    private final FeedbackReportRepository repository;

    public FeedbackReportService(FeedbackReportRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public FeedbackReport createFeedbackReport(
            FeedbackReport feedbackReport) {

        feedbackReport.setId(null);
        feedbackReport.setStatus("PENDING");

        return repository.save(feedbackReport);
    }

    // READ ALL
    public List<FeedbackReport> getAllFeedbackReports() {
        return repository.findAll();
    }

    // READ ONE
    public Optional<FeedbackReport> getFeedbackReportById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public Optional<FeedbackReport> updateFeedbackReport(
            Long id,
            FeedbackReport updatedReport) {

        return repository.findById(id).map(existingReport -> {

            existingReport.setUserName(updatedReport.getUserName());
            existingReport.setEmail(updatedReport.getEmail());
            existingReport.setReportType(updatedReport.getReportType());
            existingReport.setSubject(updatedReport.getSubject());
            existingReport.setMessage(updatedReport.getMessage());
            existingReport.setItemId(updatedReport.getItemId());
            existingReport.setStatus(updatedReport.getStatus());

            return repository.save(existingReport);
        });
    }

    // DELETE
    public boolean deleteFeedbackReport(Long id) {

        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
}
