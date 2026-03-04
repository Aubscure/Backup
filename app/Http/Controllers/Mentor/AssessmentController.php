<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentRequest;
use App\Models\Assessment;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function create()
    {
        $courseData = User::with(['courses.syllabuses.lessons'])->find(Auth::id());
        return Inertia::render('Mentor/Assessment/CreateAssess')->with('courseData', $courseData);
    }

    // public function store(Request $request)
    // {
    //     dd($request->all());
    // }

    public function store(StoreAssessmentRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $morphType = match ($validated['assessmentable_type']) {
                'syllabus' => \App\Models\Syllabus::class,
                'lesson'   => \App\Models\Lesson::class,
                default    => throw new \Exception("Invalid assessmentable type"),
            };

            $assessment = Assessment::create([
                'title'               => $validated['title'],
                'description'         => $validated['description'],
                'course_id'           => $validated['course_id'],
                'assessmentable_id'   => $validated['assessmentable_id'],
                'assessmentable_type' => $morphType,
                'is_draft'            => $validated['is_draft'],
                'passing_grade'       => $validated['passing_grade'],
                'has_time_limit'      => $validated['has_time_limit'],
                'time_limit_hrs'      => $validated['time_limit_hrs'],
                'time_limit_mins'     => $validated['time_limit_mins'],
                'time_limit_secs'     => $validated['time_limit_secs'],
                'is_randomized'       => $validated['is_randomized'],
            ]);

            foreach ($validated['questions'] as $q) {
                $question = Question::create([
                    'type'          => $q['type'],
                    'question_text' => $q['data']['question_text'],
                    'options'       => $q['data']['options'] ?? ($q['data']['items'] ?? null),
                    'answer'        => $q['data']['answer'] ?? null,
                ]);

                $assessment->questions()->attach($question->id, [
                    'points' => $q['points'],
                    'pivot_order'  => $q['order'],
                ]);
            }
        });

        return back();
    }

    // Add the destroy method
    public function destroy(Assessment $assessment)
    {
        // Executes a soft delete if the Assessment model utilizes the SoftDeletes trait.
        $assessment->delete();

        return back()->with('success', 'Assessment removed successfully.');
    }
}
